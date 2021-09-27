export interface Credentials {
    organization: string;
    token: string;
}

export interface IncidentsType {
    id: number;
    summary: string;
    details: string;
    reportTime: Date;
    resolvedOn: Date;
    status: string;
    alertSource: AlertSource;
    priority: string;
    incidentKey: string;
    assignedTo: AssignedTo;
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
    incidentCreation: string;
    status: string;
    emailFiltered: boolean;
    emailResolveFiltered: boolean;
    active: boolean;
    emailPredicates: ResolveKeyExtractor[];
    emailResolvePredicates: ResolveKeyExtractor[];
    resolveKeyExtractor: ResolveKeyExtractor;
    filterOperator: string;
    resolveFilterOperator: string;
    incidentPriorityRule: string;
    supportHours: SupportHours;
    heartbeat: Heartbeat;
    bidirectional: boolean;
    autotaskMetadata: AutotaskMetadata;
}

export interface AutotaskMetadata {
    userName: string;
    secret: string;
    apiIntegrationCode: string;
    webServer: string;
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
    user: AssignedTo;
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

export interface AssignedTo {
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
    subscribedIncidentUpdateStates: string[];
    subscribedIncidentUpdateNotificationTypes: string[];
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
    autoRaiseIncidents: boolean;
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
