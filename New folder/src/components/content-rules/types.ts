export type RuleItem = { id: string; label: string };

export type ContentRule = {
    id: string;
    title: string;
    conditions: RuleItem[];
    actions: RuleItem[];
    enabled: boolean;
};

export interface HeaderConfig {
    id: string;
    action: string;
    header: string;
    value: string;
    matchRegex?: boolean;
    regexValue?: string;
}

export interface ConditionConfig {
    id: string;
    function: string;
    stringValue: string;
    matchCase?: boolean;
    wholeWord?: boolean;
    parseXml?: boolean;
    messagePriority?: string;
    messageSize?: string;
    sizeValue?: string;
    sizeUnit?: string;
    userOnlyRecipient?: boolean;
    checkUserInToHeader?: boolean;
    // Advanced conditions
    senderRecipient?: string;
    localRemote?: string;
    ignoreUserExists?: string;
    memberOf?: string;
    scoreComparison?: string;
    scoreValue?: string;
    dnslServer?: string;
    regex?: string;
    weekdays?: boolean;
    selectedWeekdays?: string[];
    betweenTimes?: boolean;
    startTime?: string;
    endTime?: string;
    betweenDates?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface ActionConfig {
    action?: string;
    email?: string;
    forwardAsAttachment?: boolean;
    folder?: string;
    priority?: string;
    messagePriority?: string;
    flagged?: boolean;
    seen?: boolean;
    customFlags?: string;
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    hasText?: boolean;
    headerName?: string;
    headerValue?: string;
    headerAction?: string;
    matchRegex?: boolean;
    regexValue?: string;
    headers?: HeaderConfig[];
    [key: string]:
      | string
      | boolean
      | undefined
      | HeaderConfig[]
      | ConditionConfig[];
}
