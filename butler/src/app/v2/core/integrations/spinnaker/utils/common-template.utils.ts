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
import { CdConfiguration, Component, Deployment } from '../../../../api/deployments/interfaces'
import { Component } from '../../../../api/deployments/interfaces'
import { AppConstants } from '../../../../../v1/core/constants'
import { ISpinnakerConfigurationData } from '../../../../../v1/api/configurations/interfaces'

const CommonTemplateUtils = {
  getDeploymentName: (component: Component, circleId: string | null): string => {
    return `${component.name}-${component.imageTag}-${CommonTemplateUtils.getCircleId(circleId)}`
  },

  getCircleId: (circleId: string | null): string => {
    return circleId ? circleId : AppConstants.DEFAULT_CIRCLE_ID
  }

}

export { CommonTemplateUtils }