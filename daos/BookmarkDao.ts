/**
 * @file Implements DAO managing data storage of bookmark. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of Users
 * @property {BookmarkDao} BookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {

    private static bookmarkDao:BookmarkDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns BookmarkDao
     */
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}

    /**
     * Uses BookmarkModel to retrieve all Bookmark documents from Bookmark collection
     * @param {string} uid user's primary key
     * @returns Promise To be notified when the Bookmark are retrieved from
     * database
     */
    findAllTuitsBookmarkedByUser = async (uid:string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Uses BookmarkModel to retrieve all users document from users collection
     * @param {string} tid tuits's primary key
     * @returns Promise To be notified when user is retrieved from the database
     */
    findAllUsersThatBookmarkedTuit = async (tid:string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({tuit:tid})
            .populate("bookmarkedBy")
            .exec()

    /**
     * Uses BookmarkModel to bookmark a tuit.
     * @param {string} uid User's username.
     * @param {string} tid tuit's Id.
     * @returns Promise To be notified when tuit is bookmarked from the database
     */
    userBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.create({tuit: tid, bookmarkedBy: uid});

    /**
     * Uses BookmarkModel to unbookmark a tuit.
     * @param {string} uid User's username.
     * @param {string} tid tuit's Id.
     * @returns Promise To be notified when tuit is unbookmarked from the database
     */
    userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({tuit: tid, bookmarkedBy: uid});

    /**
     * find user bookmarked tuit.
     * @param {string} uid User's username.
     * @param {string} tid tuit's Id.
     * @returns Promise To be notified when tuit is retrieved from the database
     */
    findUserBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.findOne({tuit:tid, bookmarkedBy:uid});

    /**
     * count how many bookmarked in this tuit
     * @param {string} tid tuit's Id.
     * @returns Promise To be notified when user is retrieved from the database
     */
    countHowManyBookmarkedTuit = async (tid: string): Promise<any> =>
        BookmarkModel.count({tuit:tid});

}