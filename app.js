const express = require('express'); 
const app     = express(); 
const PORT    = process.env.PORT || 3000; 
 
app.use(express.json()); 
 
// Health check - ALB and ECS poll this endpoint 
app.get('/health', (req, res) => { 
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() 
}); 
}); 
 
app.get('/api/v1/hello', (req, res) => { 
  const env = process.env.APP_ENV || 'unknown'; 
  console.log(JSON.stringify({ level: 'info', path: req.path, env })); 
  res.json({ message: 'Hello from ECS Fargate!', environment: env }); 
}); 
 
const server = app.listen(PORT, () => { 
  console.log(JSON.stringify({ level: 'info', msg: `Server started on port 
${PORT}` })); 
}); 
 
// Graceful shutdown - ECS sends SIGTERM before terminating the task 
process.on('SIGTERM', () => { 
  console.log(JSON.stringify({ level: 'info', msg: 'SIGTERM received, shutting 
down' })); 
  server.close(() => process.exit(0)); 
});
