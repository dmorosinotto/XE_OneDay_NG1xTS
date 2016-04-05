CREATE TABLE [dbo].[Xe_EventSubscription](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Surname] [varchar](50) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[City] [varchar](100) NULL,
	[ConfirmationKey] [uniqueidentifier] NOT NULL,
	[IsConfirmed] [bit] NULL,
	[SubscriptionDate] [datetime] NOT NULL CONSTRAINT [DF_Xe_EventSubscription_SubscriptionDate]  DEFAULT (getdate()),
	[ConfirmationDate] [datetime] NULL,
	[IsPresent] [bit] NULL,
	[MemberId] [int] NULL,
 CONSTRAINT [PK_Xe_EventSubscription] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


INSERT INTO [XeDotNet].[dbo].[Xe_EventSubscription](EventId,Name,Surname,Email,City,ConfirmationKey,IsConfirmed,SubscriptionDate,ConfirmationDate,IsPresent,MemberId) VALUES
(9999,'Zio','Perone','zio@paperone.it','Paperopoli','6E47B265-DCE8-430A-A4D8-07E16511AD99',1,'2016-03-09 22:37:52.153','2016-03-09 22:38:16.800',0,1)

INSERT INTO [XeDotNet].[dbo].[Xe_EventSubscription](EventId,Name,Surname,Email,City,ConfirmationKey,IsConfirmed,SubscriptionDate,ConfirmationDate,IsPresent,MemberId) VALUES
(9999,'pippo','pluto','pippo@pluto.it',NULL,'26E34900-8650-4BE0-9170-B03743CD2F5B',0,'2016-04-02 04:24:34.447',NULL,1,NULL)

INSERT INTO [XeDotNet].[dbo].[Xe_EventSubscription](EventId,Name,Surname,Email,City,ConfirmationKey,IsConfirmed,SubscriptionDate,ConfirmationDate,IsPresent,MemberId) VALUES
(8888,'Mr','X','mr@x.com','Sssshhhhh it is a SECRET','9DD34840-1AEE-419F-814C-87FFA02E5EE3',1,'2016-04-03 11:27:33.010','2016-04-03 11:32:41.263',1,NULL)

INSERT INTO [XeDotNet].[dbo].[Xe_EventSubscription](EventId,Name,Surname,Email,City,ConfirmationKey,IsConfirmed,SubscriptionDate,ConfirmationDate,IsPresent,MemberId) VALUES
(8888,'Mrs','Y','mrs@y.com',NULL,'4B5128E4-A452-458B-A532-912C339177FE',1,'2016-04-03 11:27:55.363','2016-04-03 11:32:28.907',0,NULL)

INSERT INTO [XeDotNet].[dbo].[Xe_EventSubscription](EventId,Name,Surname,Email,City,ConfirmationKey,IsConfirmed,SubscriptionDate,ConfirmationDate,IsPresent,MemberId) VALUES
(9999,'a','b','c@d.it',NULL,'72FA5237-0B80-41B5-95B2-A227CA3918B2',0,'2016-04-03 23:47:31.530',NULL,0,NULL)