import express, { Router, Request, Response , Application } from 'express';

const mainRouter:Router = Router();
mainRouter.get("/main", (req:Request, res:Response)  => {
    res.send("Initial endpoint");
})

export { mainRouter }