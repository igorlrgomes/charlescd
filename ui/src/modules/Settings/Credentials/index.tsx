/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import { copyToClipboard } from 'core/utils/clipboard';
import { useWorkspace } from 'modules/Settings/hooks';
import { useActionData } from './Sections/MetricAction/hooks';
import { getWorkspaceId } from 'core/utils/workspace';
import ContentIcon from 'core/components/ContentIcon';
import { useGlobalState } from 'core/state/hooks';
import TabPanel from 'core/components/TabPanel';
import Layer from 'core/components/Layer';
import Form from 'core/components/Form';
import Section from './Sections';
import Loader from './Loaders';
import Styled from './styled';
import Dropdown from 'core/components/Dropdown';
import { useDatasource } from './Sections/MetricProvider/hooks';
import { Datasource } from './Sections/MetricProvider/interfaces';

interface Props {
  onClickHelp?: (status: boolean) => void;
}

const Credentials = ({ onClickHelp }: Props) => {
  const id = getWorkspaceId();
  const [form, setForm] = useState<string>('');
  const [, loadWorkspace, , updateWorkspace] = useWorkspace();
  const {
    responseAll: datasources,
    getAll: getAllDatasources
  } = useDatasource();
  const {
    getActionData,
    actionResponse,
    status: actionDataStatus
  } = useActionData();
  const { item: workspace, status } = useGlobalState(
    ({ workspaces }) => workspaces
  );
  const { register, handleSubmit } = useForm();

  const handleSaveClick = ({ name }: Record<string, string>) => {
    updateWorkspace(name);
  };

  const getActions = () => getActionData();

  const getDatasources = () => getAllDatasources();

  useEffect(() => {
    if (actionDataStatus.isIdle) {
      getActionData();
    }
  }, [getActionData, actionDataStatus]);

  useEffect(() => {
    if (isNull(form)) {
      loadWorkspace(id);
    }
    getAllDatasources();
  }, [id, form, loadWorkspace, getAllDatasources]);

  const renderContent = () => (
    <Layer>
      <ContentIcon icon="workspace">
        <Form.InputTitle
          name="name"
          ref={register({ required: true })}
          resume={true}
          defaultValue={workspace?.name}
          onClickSave={handleSubmit(handleSaveClick)}
        />
      </ContentIcon>
    </Layer>
  );

  const renderDropdown = () => (
    <Dropdown>
      <Dropdown.Item
        icon="copy"
        name="Copy ID"
        onClick={() => copyToClipboard(id)}
      />
      <Dropdown.Item
        icon="help"
        name="Help"
        onClick={() => onClickHelp(true)}
      />
    </Dropdown>
  );

  const renderActions = () => (
    <Styled.Actions>{renderDropdown()}</Styled.Actions>
  );

  const renderPanel = () => (
    <TabPanel
      title={workspace.name}
      name="workspace"
      size="15px"
      actions={renderActions()}
    >
      {isEmpty(form) && renderContent()}
      <Section.Registry
        form={form}
        setForm={setForm}
        data={workspace.registryConfiguration}
      />
      <Section.CDConfiguration
        form={form}
        setForm={setForm}
        data={workspace.cdConfiguration}
      />
      <Section.CircleMatcher
        form={form}
        setForm={setForm}
        data={workspace.circleMatcherUrl}
      />
      <Section.MetricProvider
        form={form}
        setForm={setForm}
        data={datasources as Datasource[]}
        getNewDatasources={getDatasources}
      />
      {actionDataStatus.isResolved && (
        <Section.MetricAction
          form={form}
          setForm={setForm}
          actions={actionResponse}
          getNewActions={getActions}
        />
      )}
      <Section.Git
        form={form}
        setForm={setForm}
        data={workspace.gitConfiguration}
      />
      <Section.UserGroup
        form={form}
        setForm={setForm}
        data={workspace.userGroups}
      />
    </TabPanel>
  );

  return (
    <Styled.Wrapper data-testid="credentials">
      {status === 'pending' || isEmpty(workspace.id) || !datasources ? (
        <Loader.Tab />
      ) : (
        renderPanel()
      )}
    </Styled.Wrapper>
  );
};

export default Credentials;
