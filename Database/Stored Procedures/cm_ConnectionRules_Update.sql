﻿
CREATE PROCEDURE [dbo].[cm_ConnectionRules_Update]
(
	@MaxConnectionsToUpper int,
	@MaxConnectionsToLower int,
	@ValidationRule nvarchar(200),
	@Original_RuleId uniqueidentifier,
	@Original_ItemUpperType uniqueidentifier,
	@Original_ItemLowerType uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_MaxConnectionsToUpper int,
	@Original_MaxConnectionsToLower int,
	@Original_ValidationRule nvarchar(200)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ConnectionRules] SET [MaxConnectionsToUpper] = @MaxConnectionsToUpper, 
	[MaxConnectionsToLower] = @MaxConnectionsToLower,
	[ValidationRule] = @ValidationRule
	WHERE (([RuleId] = @Original_RuleId) AND 
	([ItemUpperType] = @Original_ItemUpperType) AND 
	([ItemLowerType] = @Original_ItemLowerType) AND 
	([ConnType] = @Original_ConnType) AND 
	([MaxConnectionsToUpper] = @Original_MaxConnectionsToUpper) AND 
	([MaxConnectionsToLower] = @Original_MaxConnectionsToLower) AND
	(([ValidationRule] = @Original_ValidationRule)));
	
