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

package io.charlescd.circlematcher.domain.service;

import io.charlescd.circlematcher.domain.Node;
import java.util.Map;
import javax.script.ScriptException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

public interface ScriptManagerService {

    Context scriptContext();

    boolean isMatch(Node node, Map<String, Object> data);

    Value evalJsWithResult(Context context, String script, Map<String, Object> input) throws ScriptException;

    Object evalJs(Context context, String script) throws ScriptException;

    Value getResultVar(Context context);

    Value getVar(Context context, String key);
}
