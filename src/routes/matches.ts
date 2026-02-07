import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches";
import { db } from "../db/db";
import { matches } from "../db/schema";
import { getMatchStatus } from "../utils/match-status";
import { desc } from "drizzle-orm";

const matchRouter = Router()

matchRouter.get('/', async (req, res) => {

    const parsed = listMatchesQuerySchema.safeParse(req.query)

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid request",
            errors: parsed.error.issues
        })
    }

    try {
        const events = await db
            .select()
            .from(matches)
            .orderBy(desc(matches.createdAt))
            .limit(Math.min(parsed.data.limit || 50, 100))
        return res.status(200).json({
            message: "Matches fetched successfully",
            data: events
        })
        
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch matches.", details: JSON.stringify(error) })
    }
})

matchRouter.post('/', async (req, res) => {

    const parsed = createMatchSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid request",
            errors: parsed.error.issues
        })
    }

    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(parsed.data.startTime),
            endTime: new Date(parsed.data.endTime),
            homeScore: parsed.data.homeScore || 0,
            awayScore: parsed.data.awayScore || 0,
            status: getMatchStatus(parsed.data.startTime, parsed.data.endTime, new Date()) || 'scheduled'
        }).returning()
        return res.status(201).json({
            message: "Match created successfully",
            data: event
        })
    } catch (error) {
        return res.status(500).json({ error: "Failed to create match.", details: JSON.stringify(error) })
    }

    res.status(200).json({
        message: "Hello World!"
    })
})

export default matchRouter
