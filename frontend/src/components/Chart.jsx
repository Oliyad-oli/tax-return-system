import { useEffect, useRef } from 'react';

function Chart({ data, type = 'bar', title = 'Monthly Returns' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set dimensions
    const chartWidth = width - 100;
    const chartHeight = height - 80;
    const startX = 60;
    const startY = 30;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.count || d.amount || 0), 10);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + chartHeight);
    // X-axis
    ctx.moveTo(startX, startY + chartHeight);
    ctx.lineTo(startX + chartWidth, startY + chartHeight);
    ctx.stroke();

    // Draw bars or line
    const barWidth = (chartWidth / data.length) * 0.7;
    const barSpacing = (chartWidth / data.length) * 0.3;

    if (type === 'bar') {
      data.forEach((item, index) => {
        const value = item.count || 0;
        const barHeight = (value / maxValue) * chartHeight;
        const x = startX + (index * (barWidth + barSpacing)) + barSpacing / 2;
        const y = startY + chartHeight - barHeight;
        
        // Gradient fill
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#60a5fa');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(value, x + barWidth / 2 - 10, y - 5);
        
        // Draw label
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.fillText(item.month || item.name, x + barWidth / 2 - 15, startY + chartHeight + 15);
      });
    }

    // Add title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(title, width / 2 - 50, 20);

  }, [data, type, title]);

  return (
    <div className="w-full h-64">
      <canvas ref={canvasRef} width={600} height={250} className="w-full h-full"></canvas>
    </div>
  );
}

export default Chart;