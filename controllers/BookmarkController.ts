/**
 * @file Controller RESTful Web service API for Bookmarks resource
 */
import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import TuitDao from "../daos/TuitDao";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/bookmarks/tuits/:tid to record that a user bookmarks a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/bookmarks/tuits/:tid to record that a user no longer bookmarks a tuit
 *     </li>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all the tuits bookmarked by a user
 *     </li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} BookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);
            app.get("/api/tuits/:tid/bookmarks", BookmarkController.bookmarkController.findAllUsersThatBookmarkedTuit);
            app.put("/api/users/:uid/bookmarks/:tid",BookmarkController.bookmarkController.userTogglesTuitBookmarks);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all users that bookmarked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedTuit(req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all tuits bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarked
     */
    findAllTuitsBookmarkedByUser = (req: Request, res: Response) =>{
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(userId)
            .then(bookmarks => {
                const bookmarksNonNullTuits = bookmarks.filter(bookmark => bookmark.tuit);
                const tuitsFromBookmarks = bookmarksNonNullTuits.map(bookmark => bookmark.tuit);
                res.json(tuitsFromBookmarks);
            })
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userTogglesTuitBookmarks = async (req: Request, res: Response) =>{
        const bookmarkDao = BookmarkController.bookmarkDao;
        const tuitDao = BookmarkController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try{
            const userAlreadyBookmarkedTuit = await bookmarkDao.findUserBookmarksTuit(userId, tid);
            const howManyBookmarkedTuit = await bookmarkDao.countHowManyBookmarkedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyBookmarkedTuit){
                await bookmarkDao.userUnbookmarksTuit(userId, tid);
                tuit.stats.bookmarks = howManyBookmarkedTuit - 1;
            }
            else {
                await BookmarkController.bookmarkDao.userBookmarksTuit(userId, tid);
                tuit.stats.bookmarks = howManyBookmarkedTuit + 1;
            };
            await tuitDao.updateBookmarks(tid, tuit.stats);
            res.sendStatus(200);
        }
        catch (e){
            res.sendStatus(404);
        }
    }

};