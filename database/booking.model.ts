import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Event from './event.model';

/**
 * Booking document interface for type safety
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validates email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Booking schema with reference validation
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validateEmail,
        message: 'Invalid email format',
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Create index on eventId for faster queries
 */
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook: Verify that the referenced event exists
 */
bookingSchema.pre<IBooking>('save', async function () {
  try {
    const eventExists = await Event.findById(this.eventId);
    if (!eventExists) {
      throw new Error(`Event with ID ${this.eventId} does not exist`);
    }
  } catch (error) {
    throw new Error(error as string);
  }
});

/**
 * Create or get Booking model with type safety
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
