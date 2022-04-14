import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";

export default class BookmarkDao implements BookmarkDaoI {

    private static bookmarkDao:BookmarkDao | null = null;
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}
    findAllTuitsBookmarkedByUser = async (uid:string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy: uid})
            .populate("tuit")
            .exec();
    findAllUsersThatBookmarkedTuit = async (tid:string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({tuit:tid})
            .populate("bookmarkedBy")
            .exec()
    userBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.create({tuit: tid, bookmarkedBy: uid});
    userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({tuit: tid, bookmarkedBy: uid});
    findUserBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.findOne({tuit:tid, bookmarkedBy:uid});
    countHowManyBookmarkedTuit = async (tid: string): Promise<any> =>
        BookmarkModel.count({tuit:tid});

}