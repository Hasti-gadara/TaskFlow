import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'TaskFlow API is online' });
};
