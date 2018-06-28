CREATE TABLE [dbo].[cm_ConnectionsHistory] (
    [ConnId]           UNIQUEIDENTIFIER NOT NULL,
    [ConnType]         UNIQUEIDENTIFIER NOT NULL,
    [ConnTypeName]     NVARCHAR (50)    NOT NULL,
    [ConnUpperItem]    UNIQUEIDENTIFIER NOT NULL,
    [ConnLowerItem]    UNIQUEIDENTIFIER NOT NULL,
    [ConnectionRuleId] UNIQUEIDENTIFIER NOT NULL,
	[ConnDescription]  NVARCHAR (100)   NOT NULL,
    [ConnChange]       DATETIME         NOT NULL,
    [ConnReason]       NVARCHAR (50)    NOT NULL,
    [ChangedByToken]   NVARCHAR (50)    NOT NULL
);

