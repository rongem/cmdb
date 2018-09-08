
CREATE PROCEDURE [dbo].[cm_ItemTypes_Delete]
(
	@Original_TypeId uniqueidentifier,
	@Original_TypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
BEGIN TRY
	BEGIN TRANSACTION;
		DELETE FROM [cm_ConnectionRules] 
			WHERE (([ItemUpperType] = @Original_TypeId) OR ([ItemLowerType] = @Original_TypeId));
		DELETE FROM [cm_ItemTypeAttributeGroupMappings]
			WHERE ([ItemTypeId] = @Original_TypeId);
		DELETE FROM [cm_ItemTypes] 
			WHERE (([TypeId] = @Original_TypeId) AND ([TypeName] = @Original_TypeName));
		IF @@ROWCOUNT = 0
		BEGIN
			ROLLBACK TRANSACTION;
		END
		ELSE
		BEGIN
			COMMIT TRANSACTION;
		END
END TRY
BEGIN CATCH
    IF (XACT_STATE()) = -1  
    BEGIN  
        ROLLBACK TRANSACTION;  
    END;  

    -- Test whether the transaction is active and valid.  
    IF (XACT_STATE()) = 1  
    BEGIN  
        COMMIT TRANSACTION;     
    END;  
END CATCH