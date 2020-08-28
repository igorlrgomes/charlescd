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

import { SpinnakerPipeline } from '../../../../../../app/v2/core/integrations/spinnaker/interfaces'
import { AppConstants } from '../../../../../../app/v1/core/constants'
import { ExecutionTypeEnum } from '../../../../../../app/v2/api/deployments/enums'
import { DeploymentStatusEnum } from '../../../../../../app/v1/api/deployments/enums'

export const hostnameGatewayUndeploymentPipeline: SpinnakerPipeline = {
  application: 'app-cd-configuration-id',
  name: 'deployment-id',
  expectedArtifacts: [],
  stages: [
    {
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'DestinationRule',
          metadata: {
            name: 'A',
            namespace: 'sandbox'
          },
          spec: {
            host: 'host-value-1',
            subsets: [
              {
                labels: {
                  version: 'A-v0'
                },
                name: 'v0'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Undeploy Destination Rules A',
      refId: '1',
      requisiteStageRefIds: [],
      skipExpressionEvaluation: false,
      source: 'text',
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest'
    },
    {
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: 'A',
            namespace: 'sandbox'
          },
          spec: {
            gateways: ['gateway-name-1'],
            hosts: [
              'host-value-1'
            ],
            http: [
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id2.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      'x-circle-id': {
                        exact: 'circle-id2'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id2'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      cookie: {
                        regex: '.*x-circle-id=circle-id3.*'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      }
                    }
                  }
                ]
              },
              {
                match: [
                  {
                    headers: {
                      'x-circle-id': {
                        exact: 'circle-id3'
                      }
                    }
                  }
                ],
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': 'circle-id3'
                        }
                      }
                    }
                  }
                ]
              },
              {
                route: [
                  {
                    destination: {
                      host: 'A',
                      subset: 'v0'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Undeploy Virtual Service A',
      refId: '2',
      requisiteStageRefIds: [
        '1'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Undeploy Destination Rules A\').status.toString() == \'SUCCEEDED\'}',
        type: 'expression'
      },
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest'
    },
    {
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'DestinationRule',
          metadata: {
            name: 'B',
            namespace: 'sandbox'
          },
          spec: {
            host: 'host-value-2',
            subsets: [
              {
                labels: {
                  version: 'B-v1'
                },
                name: 'v1'
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Undeploy Destination Rules B',
      refId: '3',
      requisiteStageRefIds: [],
      skipExpressionEvaluation: false,
      source: 'text',
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest'
    },
    {
      account: 'default',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      manifests: [
        {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: 'B',
            namespace: 'sandbox'
          },
          spec: {
            gateways: ['gateway-name-2'],
            hosts: [
              'host-value-2'
            ],
            http: [
              {
                route: [
                  {
                    destination: {
                      host: 'B',
                      subset: 'v1'
                    },
                    headers: {
                      request: {
                        set: {
                          'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                        }
                      },
                      response: {
                        set: {
                          'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ],
      moniker: {
        app: 'default'
      },
      name: 'Undeploy Virtual Service B',
      refId: '4',
      requisiteStageRefIds: [
        '3'
      ],
      skipExpressionEvaluation: false,
      source: 'text',
      stageEnabled: {
        expression: '${ #stage(\'Undeploy Destination Rules B\').status.toString() == \'SUCCEEDED\'}',
        type: 'expression'
      },
      trafficManagement: {
        enabled: false,
        options: {
          enableTraffic: false,
          services: []
        }
      },
      type: 'deployManifest'
    },
    {
      failOnFailedExpressions: true,
      name: 'Evaluate proxy undeployments',
      refId: '5',
      requisiteStageRefIds: [
        '2',
        '4'
      ],
      type: 'evaluateVariables',
      variables: [
        {
          key: 'proxyUndeploymentsResult',
          value: '${#stage(\'Undeploy Virtual Service A\').status.toString() == \'SUCCEEDED\' && #stage(\'Undeploy Virtual Service B\').status.toString() == \'SUCCEEDED\'}'
        }
      ]
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      customHeaders: {
        'x-circle-id': 'Default'
      },
      failPipeline: false,
      method: 'POST',
      name: 'Trigger Failure Webhook',
      payload: {
        status: DeploymentStatusEnum.FAILED,
        type: ExecutionTypeEnum.UNDEPLOYMENT
      },
      refId: '6',
      requisiteStageRefIds: [
        '5'
      ],
      stageEnabled: {
        expression: '${ !proxyUndeploymentsResult }',
        type: 'expression'
      },
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'http://localhost:8883/butler/v2/executions/execution-id/notify'
    },
    {
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      customHeaders: {
        'x-circle-id': 'Default'
      },
      failPipeline: false,
      method: 'POST',
      name: 'Trigger Success Webhook',
      payload: {
        status: DeploymentStatusEnum.SUCCEEDED,
        type: ExecutionTypeEnum.UNDEPLOYMENT
      },
      refId: '7',
      requisiteStageRefIds: [
        '5',
      ],
      stageEnabled: {
        expression: '${ proxyUndeploymentsResult }',
        type: 'expression'
      },
      statusUrlResolution: 'getMethod',
      type: 'webhook',
      url: 'http://localhost:8883/butler/v2/executions/execution-id/notify'
    },
    {
      account: 'default',
      app: 'app-cd-configuration-id',
      cloudProvider: 'kubernetes',
      completeOtherBranchesThenFail: false,
      continuePipeline: true,
      failPipeline: false,
      kinds: [
        'deployment'
      ],
      labelSelectors: {
        selectors: [
          {
            key: 'app',
            kind: 'EQUALS',
            values: [
              'A'
            ]
          },
          {
            key: 'version',
            kind: 'EQUALS',
            values: [
              'A-v1'
            ]
          }
        ]
      },
      location: 'sandbox',
      mode: 'label',
      name: 'Delete Unused Deployment A v1',
      nameStage: 'Delete Deployments',
      options: {
        cascading: true
      },
      refId: '8',
      requisiteStageRefIds: [
        '5'
      ],
      stageEnabled: {
        expression: '${proxyUndeploymentsResult}',
        type: 'expression'
      },
      type: 'deleteManifest'
    }
  ]
}