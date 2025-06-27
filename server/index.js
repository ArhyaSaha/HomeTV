import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure your MONGODB_URI is correct and your IP is whitelisted in MongoDB Atlas');
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB Atlas connection closed through app termination');
  process.exit(0);
});

connectDB();

// Link Schema with enhanced validation
const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlPattern.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isFavourite: {
    type: Boolean,
    default: false,
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Add indexes for better performance
linkSchema.index({ createdAt: -1 });
linkSchema.index({ isFavourite: 1 });
linkSchema.index({ tags: 1 });

const Link = mongoose.model('Link', linkSchema);

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'MyTV API is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Get all links (sorted by creation date, newest first)
app.get('/api/links', asyncHandler(async (req, res) => {
  const links = await Link.find().sort({ createdAt: -1 });
  res.json(links);
}));

// Get favourite links
app.get('/api/links/favourites', asyncHandler(async (req, res) => {
  const favouriteLinks = await Link.find({ isFavourite: true }).sort({ createdAt: -1 });
  res.json(favouriteLinks);
}));

// Create a new link
app.post('/api/links', asyncHandler(async (req, res) => {
  const { url, title, tags } = req.body;
  
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  // Normalize URL - add https if no protocol specified
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  const newLink = new Link({
    url: normalizedUrl,
    title: title?.trim() || '',
    tags: tags ? tags.filter(tag => tag.trim()).map(tag => tag.trim()) : [],
  });

  const savedLink = await newLink.save();
  res.status(201).json(savedLink);
}));

// Update a link
app.put('/api/links/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { url, title, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid link ID' });
  }

  // Normalize URL if provided
  let normalizedUrl = url;
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    normalizedUrl = 'https://' + url;
  }

  const updatedLink = await Link.findByIdAndUpdate(
    id,
    { 
      url: normalizedUrl,
      title: title?.trim() || '',
      tags: tags ? tags.filter(tag => tag.trim()).map(tag => tag.trim()) : []
    },
    { new: true, runValidators: true }
  );

  if (!updatedLink) {
    return res.status(404).json({ message: 'Link not found' });
  }

  res.json(updatedLink);
}));

// Delete a link
app.delete('/api/links/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid link ID' });
  }
  
  const deletedLink = await Link.findByIdAndDelete(id);
  
  if (!deletedLink) {
    return res.status(404).json({ message: 'Link not found' });
  }

  res.json({ message: 'Link deleted successfully' });
}));

// Toggle favourite status
app.patch('/api/links/:id/favourite', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid link ID' });
  }

  const updatedLink = await Link.findByIdAndUpdate(
    id,
    { isFavourite: Boolean(isFavourite) },
    { new: true }
  );

  if (!updatedLink) {
    return res.status(404).json({ message: 'Link not found' });
  }

  res.json(updatedLink);
}));

// Increment click count (optional analytics)
app.patch('/api/links/:id/click', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid link ID' });
  }

  const updatedLink = await Link.findByIdAndUpdate(
    id,
    { $inc: { clickCount: 1 } },
    { new: true }
  );

  if (!updatedLink) {
    return res.status(404).json({ message: 'Link not found' });
  }

  res.json(updatedLink);
}));

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ message: 'Validation Error', errors });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`💡 Make sure to set your MONGODB_URI in the .env file`);
});