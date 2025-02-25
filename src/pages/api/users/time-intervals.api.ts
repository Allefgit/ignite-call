import { NextApiResponse, NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOption } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinuts: z.number(),
      endTimeInMinuts: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOption(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_end_in_minuts: interval.endTimeInMinuts,
          time_start_in_minuts: interval.startTimeInMinuts,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
