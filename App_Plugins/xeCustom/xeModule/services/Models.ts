namespace xeModule.Models {
    export interface ISubscription {
        "Id": number,
        "EventId": number,
        "Name": string,
        "Surname": string,
        "Email": string,
        "City": string,
        "ConfirmationKey": string, //guid string
        "IsConfirmed": boolean,
        "SubscriptionDate": string, //date UTC isoformat
        "ConfirmationDate": string, //date UTC isoformat
        "IsPresent": boolean,
        "MemberId": number
    }

    export interface IRegistration {
        "EventId": number,
        "Name": string,
        "Surname": string,
        "Email": string,
        "City": string,
        "Privacy": boolean //must be true!
    }

    export type IEventHandler<T> = (ret: { $event: T }) => void; //callback gestori eventi in output (binding '& ') che ritorna $event
}