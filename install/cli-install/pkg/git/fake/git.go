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

package fake

import (
	"installer/pkg/git"
)

type GitManagerFake struct{}

func NewGitManagerFake() git.ManagerUseCases {
	return &GitManagerFake{}
}

type GitFake struct{}

func (g GitManagerFake) NewGit(gitProviderType string) (git.GitUseCases, error) {
	return &GitFake{}, nil
}

func (g GitFake) GetDataFromDefaultFiles(name, token, url string) ([]string, error) {
	contents := []string{
		"content-1",
	}

	return contents, nil
}
