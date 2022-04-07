import mongoose, {Schema} from "mongoose";
import Follow from "../../models/follows/Follow";

const FollowSchema = new mongoose.Schema<Follow>({
    user: {type: Schema.Types.ObjectId, ref: "UserModel"},
    followedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "follows"});
export default FollowSchema;