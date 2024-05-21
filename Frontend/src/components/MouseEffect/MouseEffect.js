import React, { useEffect, useRef, useState } from 'react';

const MouseEffect = () => {
    const canvasRef = useRef(null);
    const [particles, setParticles] = useState([]);

    const MAX_PARTICLES = 280;
    const COLOURS = [
        "#69D2E7",
        "#A7DBD8",
        "#E0E4CC",
        "#F38630",
        "#FA6900",
        "#FF4E50",
        "#F9D423"
    ];

    const spawnParticle = (x, y) => {
        if (particles.length >= MAX_PARTICLES) {
            setParticles((prevParticles) => prevParticles.slice(1));
        }

        const newParticle = {
            x,
            y,
            radius: Math.random() * 35 + 5,
            wander: Math.random() * 1.5 + 0.5,
            color: COLOURS[Math.floor(Math.random() * COLOURS.length)],
            drag: Math.random() * 0.09 + 0.9,
            vx: Math.sin(Math.random() * 2 * Math.PI) * Math.random() * 8 + 2,
            vy: Math.cos(Math.random() * 2 * Math.PI) * Math.random() * 8 + 2
        };

        setParticles((prevParticles) => [...prevParticles, newParticle]);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const updateParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                particle.x += particle.vx;
                particle.y += particle.vy;

                particle.vx *= particle.drag;
                particle.vy *= particle.drag;

                particle.theta += Math.random() * 2 - 1 * particle.wander;
                particle.vx += Math.sin(particle.theta) * 0.1;
                particle.vy += Math.cos(particle.theta) * 0.1;

                particle.radius *= 0.96;
                particle.alive = particle.radius > 0.5;
            }

            setParticles((prevParticles) => prevParticles.filter((particle) => particle.alive));
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            }
        };

        const animate = () => {
            updateParticles();
            drawParticles();
            requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            spawnParticle(clientX, clientY);
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%'}} />;
};

export default MouseEffect;
