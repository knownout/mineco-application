/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";

export default function Condition (props: { children: any, condition: any }) {
    return Boolean(props.condition) ? props.children : null;
}
