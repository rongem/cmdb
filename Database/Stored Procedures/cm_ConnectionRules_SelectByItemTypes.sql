﻿


CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemTypes]
(
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower, ValidationRule
FROM         cm_ConnectionRules
	WHERE ItemUpperType = @ItemUpperType
		AND ItemLowerType = @ItemLowerType;



