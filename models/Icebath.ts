import mongoose, { Schema, Document } from "mongoose";

export interface IIcebath extends Document {
  date: Date;
  temperature: number;
  duration: number;
  notes?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IcebathSchema = new Schema<IIcebath>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index für schnelle Sortierung nach Datum
IcebathSchema.index({ date: -1 });
IcebathSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Icebath || mongoose.model<IIcebath>("Icebath", IcebathSchema);

