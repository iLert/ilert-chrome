export interface Credentials {
    organization: string;
    token: string;
}

export interface Alert {
    id: number;
    summary: string;
    details: string | null;
    reportTime: Date;
    resolvedOn: Date;
    status: string;
    alertSource: AlertSource;
    priority: string;
    alertKey: string;
    assignedTo: User;
    nextEscalation: Date;
    images: Image[];
    links: Link[];
}

export interface AlertSource {
    id: number;
    teams: Team[];
    name: string;
    iconUrl: string;
    lightIconUrl: string;
    darkIconUrl: string;
    escalationPolicy: EscalationPolicy;
    integrationType: string;
    integrationKey: string;
    integrationUrl: string;
    autoResolutionTimeout: string;
    alertCreation: string;
    status: string;
    emailFiltered: boolean;
    emailResolveFiltered: boolean;
    active: boolean;
    emailPredicates: ResolveKeyExtractor[];
    emailResolvePredicates: ResolveKeyExtractor[];
    resolveKeyExtractor: ResolveKeyExtractor;
    filterOperator: string;
    resolveFilterOperator: string;
    alertPriorityRule: string;
    supportHours: SupportHours;
    heartbeat: Heartbeat;
    bidirectional: boolean;
}

export interface ResolveKeyExtractor {
    field: string;
    criteria: string;
    value: string;
}

export interface EscalationPolicy {
    id: number;
    name: string;
    escalationRules: EscalationRule[];
    teams: Team[];
    repeating: boolean;
    frequency: number;
    routingKey: string;
}

export interface EscalationRule {
    user: User;
    schedule: Schedule;
    escalationTimeout: number;
}

export interface Schedule {
    id: number;
    name: string;
    teams: Team[];
    timezone: string;
    startsOn: Date;
}

export interface Team {
    id: number;
    name: string;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: Landline;
    landline: Landline;
    timezone: string;
    position: string;
    department: string;
    avatarUrl: string;
    language: string;
    role: string;
    notificationPreferences: NotificationPreference[];
    lowPriorityNotificationPreferences: NotificationPreference[];
    onCallNotificationPreferences: OnCallNotificationPreference[];
    subscribedAlertUpdateStates: string[];
    subscribedAlertUpdateNotificationTypes: string[];
}

export interface Landline {
    regionCode: string;
    number: string;
}

export interface NotificationPreference {
    delay: number;
    method: string;
}

export interface OnCallNotificationPreference {
    beforeMin: number;
    method: string;
}

export interface Heartbeat {
    summary: string;
    intervalSec: number;
    status: string;
    lastPingReceivedAt: Date;
}

export interface SupportHours {
    timezone: string;
    autoRaiseAlerts: boolean;
    supportDays: SupportDays;
}

export interface SupportDays {
    MONDAY: Day;
    TUESDAY: Day;
    WEDNESDAY: Day;
    THURSDAY: Day;
    FRIDAY: Day;
    SATURDAY: Day;
    SUNDAY: Day;
}

export interface Day {
    start: string;
    end: string;
}

export interface Image {
    src: string;
    href: string;
    alt: string;
}

export interface Link {
    href: string;
    text: string;
}
