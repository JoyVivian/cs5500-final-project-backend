/**
 * @file Implements DAO managing data storage of follow. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of follow
 * @property {FollowDao} FollowDao Private single instance of follow
 */
export default class FollowDao implements FollowDaoI {

    private static followDao: FollowDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns FollowDao
     */
    public static getInstance = (): FollowDao => {
        if(FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}

    /**
     * Uses FollowModel to retrieve all follow documents from Follow collection
     * @param {string} uid user's primary key
     * @returns Promise To be notified when the follow relationship are retrieved from
     * database
     */
    findAllUsersFollowedByUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({followedBy:uid})
            .populate("user")
            .exec();

    /**
     * Uses FollowModel to retrieve all follow documents from Follow collection
     * @param {string} uid user's primary key
     * @returns Promise To be notified when the follow relationship are retrieved from
     * database
     */
    findAllUsersThatFollowUser = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({user: uid})
            .populate("followedBy")
            .exec();

    /**
     * Uses FollowModel to follow another user from Follow collection
     * @param {string} uid1 user's primary key
     * @param {string} uid1 user's primary key
     * @returns Promise To be notified when the follow relationship are build in database.
     */
    userFollowsAnotherUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.create({user: uid1, followedBy:uid2});

    /**
     * Uses FollowModel to unfollow another user from Follow collection
     * @param {string} uid1 user's primary key
     * @param {string} uid1 user's primary key
     * @returns Promise To be notified when the unfollow relationship are build in database.
     */
    userUnfollowsAnotherUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.deleteOne({user: uid1, followedBy:uid2});

    /**
     * Uses FollowModel to find the follow relationship between two users.
     * @param {string} uid1 user's primary key
     * @param {string} uid1 user's primary key
     * @returns Promise To be notified when the follow relationship were found in database.
     */
    findUserFollowAnotherUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.find({user: uid1, followedBy: uid2});
}