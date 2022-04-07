import FollowDaoI from "../interfaces/FollowDaoI";
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";

export default class FollowDao implements FollowDaoI {

    private static followDao: FollowDao | null = null;
    public static getInstance = (): FollowDao => {
        if(FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}
    findAllUsersFollowedByUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({followedBy:uid})
            .populate("user")
            .exec();
    findAllUsersThatFollowUser = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({user: uid})
            .populate("followedBy")
            .exec();
    userFollowsAnotherUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.create({user: uid1, followedBy:uid2});
    userUnfollowsAnotherUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.deleteOne({user: uid1, followedBy:uid2})
}