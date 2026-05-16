import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/withAuth'
import { getProjects, upsertProject, deleteProject } from '@/lib/data'

export async function GET() {
  const projects = await getProjects()
  return NextResponse.json(projects)
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const project = await upsertProject(body)
    return NextResponse.json(project)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const project = await upsertProject(body)
    return NextResponse.json(project)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { id } = await req.json()
    await deleteProject(id)
    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
})
