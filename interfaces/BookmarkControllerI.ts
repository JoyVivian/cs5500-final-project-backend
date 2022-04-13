
import {Request, Response} from "express";

export default interface BookmarkControllerI {
    findAllTuitsBookmarkedByUser (req: Request, res: Response): void;
    findAllUsersThatBookmarkedTuit(req:Request, res:Response):void;
    userTogglesTuitBookmarks(req:Request, res:Response):void;
};