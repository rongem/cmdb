import { Request, Response, NextFunction } from 'express';

import connectionRuleModel from '../../models/mongoose/connection-rule.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';

// read
export function getConnectionRules(req: Request, res: Response, next: NextFunction) {}

export function getConnectionRulesForItemType(req: Request, res: Response, next: NextFunction) {}

export function getConnectionRulesForUpperItemType(req: Request, res: Response, next: NextFunction) {}

export function getConnectionRulesForLowerItemType(req: Request, res: Response, next: NextFunction) {}

export function getConnectionRulesForUpperAndLowerItemType(req: Request, res: Response, next: NextFunction) {}

export function getConnectionRule(req: Request, res: Response, next: NextFunction) {}

export function getConnectionRuleByContent(req: Request, res: Response, next: NextFunction) {}

export function getConnectionsCountForConnectionRule(req: Request, res: Response, next: NextFunction) {}

// create
export function createConnectionRule(req: Request, res: Response, next: NextFunction) {}

// update
export function updateConnectionRule(req: Request, res: Response, next: NextFunction) {}

// delete
export function deleteConnectionRule(req: Request, res: Response, next: NextFunction) {}

export function canDeleteConnectionRule(req: Request, res: Response, next: NextFunction) {}
