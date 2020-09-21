/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package main

import (
	"compass/pkg/action"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
)

const adminEmail = "charlesadmin@admin"

type executionConfiguration struct {
	DestinationCircleID string `json:"destinationCircleId"`
}

type actionConfiguration struct {
	MooveURL string `json:"mooveUrl"`
}

func Do(actionConfig []byte, executionConfig []byte, parameters action.DataParameters) error {
	var ac *actionConfiguration
	err := json.Unmarshal(actionConfig, &ac)
	if err != nil {
		logger.Error("ACTION_PARSE_ERROR", "DoDeploymentAction", err, nil)
		return err
	}

	var ec *executionConfiguration
	err = json.Unmarshal(executionConfig, &ec)
	if err != nil {
		logger.Error("EXECUTION_PARSE_ERROR", "DoDeploymentAction", err, nil)
		return err
	}

	var workspaceID = parameters.Group.WorkspaceID.String()
	deployment, err := getCurrentDeploymentAtCircle(parameters.Group.CircleID.String(), workspaceID, ac.MooveURL)
	if err != nil {
		dataErr := fmt.Sprintf("MooveUrl: %s, CircleId: %s, WorkspaceId: %s", ac.MooveURL, parameters.Group.CircleID.String(), workspaceID)
		logger.Error("DO_CIRCLE_GET", "DoDeploymentAction", err, dataErr)
		return err
	}

	if deployment.BuildId == "" {
		err = errors.New("circle has no active build")
		dataErr := fmt.Sprintf("CircleId: %s, WorkspaceId: %s", parameters.Group.CircleID.String(), workspaceID)
		logger.Error("DO_CIRCLE_GET", "DoDeploymentAction", err, dataErr)
		return err
	}

	user, err := getUserByEmail(adminEmail, ac.MooveURL)
	if err != nil {
		logger.Error("DO_USER_FIND", "DoDeploymentAction", err, ac.MooveURL)
		return err
	}

	request := DeploymentRequest{
		AuthorID: user.Id,
		CircleID: ec.DestinationCircleID,
		BuildID:  deployment.BuildId,
	}

	err = deployBuildAtCircle(request, workspaceID, ac.MooveURL)
	if err != nil {
		dataErr := fmt.Sprintf("MooveUrl: %s, WorkspaceId: %s, DestinationCircleId: %s, BuildId: %s, AuthorId: %s",
			ac.MooveURL, workspaceID, ec.DestinationCircleID, deployment.BuildId, user.Id)
		logger.Error("DO_CIRCLE_DEPLOYMENT", "DoDeploymentAction", err, dataErr)
		return err
	}

	return nil
}

func GetActionConfigTemplate() ([]byte, error) {
	template, err := json.Marshal(`{
    "fields": [
        {
            "name": "destinationCircleId",
            "type": "string",
            "label": "",
            "tooltip": "If there is any release deployed at circle, it will be overwritten"
        }
    ]
	}`)
	if err != nil {
		return nil, err
	}

	return template, nil
}

func GetExecutionConfigTemplate() ([]byte, error) {
	template, err := json.Marshal(`"fields": [
        {
            "name": "mooveUrl",
            "type": "string",
            "label": "",
            "tooltip": "Could be a service name, or a http url"
        }
    ]
	}`)

	if err != nil {
		return nil, err
	}

	return template, nil
}

func ValidateExecutionConfiguration(executionConfig []byte) error {
	var config executionConfiguration
	err := json.Unmarshal(executionConfig, &config)
	if err != nil {
		logger.Error("VALIDATE_CIRCLE_ACTION_EXECUTION_CONFIG", "ValidateExecutionConfiguration", err, nil)
		return errors.New("error validating execution configuration")
	}

	if config.DestinationCircleID == "" {
		return errors.New("destination circle id is required")
	}

	return nil
}

func ValidateActionConfiguration(actionConfig []byte) error {
	var config actionConfiguration
	err := json.Unmarshal(actionConfig, &config)
	if err != nil {
		logger.Error("VALIDATE_CIRCLE_ACTION_CONFIG", "ValidateActionConfiguration", err, nil)
		return errors.New("error validating action configuration")
	}

	if config.MooveURL == "" {
		return errors.New("moove url is required")
	}

	return nil
}
