import { describe, it, expect } from 'vitest';
import { calculateProjectileValues, checkAnswer, g, toRad, calculateResultant } from './physics-calculations';

describe('physics-calculations', () => {
    describe('calculateProjectileValues', () => {
        it('should calculate correct values for standard input', () => {
            const v0 = 20;
            const angle = 45;
            const t = 2;

            const result = calculateProjectileValues(v0, angle, t);

            const rad = toRad(angle);
            const vy0 = v0 * Math.sin(rad);


            // Expected values
            const expectedPosY = vy0 * t - 0.5 * g * t * t;
            const expectedVelY = vy0 - g * t;
            const expectedTimeMax = vy0 / g;

            expect(result.posY).toBeCloseTo(expectedPosY);
            expect(result.velY).toBeCloseTo(expectedVelY);
            expect(result.timeMax).toBeCloseTo(expectedTimeMax);
        });

        it('should handle t=0 correctly', () => {
            const result = calculateProjectileValues(10, 30, 0);
            expect(result.posY).toBe(0);
            expect(result.velY).toBeCloseTo(10 * Math.sin(Math.PI / 6)); // 5
        });
    });

    describe('checkAnswer', () => {
        it('should return true for correct answer within tolerance', () => {
            expect(checkAnswer('10', 10)).toBe(true);
            expect(checkAnswer('10.4', 10, 5)).toBe(true); // 5% of 10 is 0.5, so 9.5 to 10.5 is ok
        });

        it('should return false for incorrect answer', () => {
            expect(checkAnswer('12', 10)).toBe(false);
        });

        it('should handle zero correctly', () => {
            expect(checkAnswer('0', 0)).toBe(true);
            expect(checkAnswer('0.05', 0)).toBe(true); // default absolute tolerance for 0 is 0.1
            expect(checkAnswer('0.2', 0)).toBe(false);
        });
    });

    describe('Vector Calculations', () => {
        it('should calculate correct resultant for A(15, 30) and B(20, 120)', () => {
            const magA = 15;
            const angA = 30;
            const magB = 20;
            const angB = 120;

            const result = calculateResultant(magA, angA, magB, angB);

            // Expected:
            // Ax = 15 * cos(30) = 12.99
            // Ay = 15 * sin(30) = 7.5
            // Bx = 20 * cos(120) = -10
            // By = 20 * sin(120) = 17.32
            // Rx = 2.99
            // Ry = 24.82

            expect(result.x).toBeCloseTo(2.99, 1);
            expect(result.y).toBeCloseTo(24.82, 1);
            expect(result.magnitude).toBeCloseTo(25.0, 1);
        });
    });
});
