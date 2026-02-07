import { z } from 'zod';

export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
} as const;

export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z.object({
    sport: z.string().min(1, 'Sport is required'),
    homeTeam: z.string().min(1, 'Home team is required'),
    awayTeam: z.string().min(1, 'Away team is required'),
    startTime: z.string().datetime({ message: "Invalid ISO date string for startTime" }).transform((data) => new Date(data)),
    endTime: z.string().datetime({ message: "Invalid ISO date string for endTime" }).transform((data) => new Date(data)),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data, ctx) => {
    const start = data.startTime;
    const end = data.endTime;
    if (end <= start) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "endTime must be after startTime",
            path: ["endTime"],
        });
    }
});

export const updateScoreSchema = z.object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
});
