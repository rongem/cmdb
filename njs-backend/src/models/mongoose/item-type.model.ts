import mongoose from 'mongoose';

const itemTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  color: {
    type: String,
    required: true,
  },
  attributeGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AttributeGroup',
  }],
});

export default mongoose.model('ItemType', itemTypeSchema);
