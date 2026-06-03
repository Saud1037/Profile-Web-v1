import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PROFILE } from "@/lib/constants";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO  = process.env.GITHUB_REPO!;   // e.g. "Saud1037/oda-web"
const FILE_PATH    = "public/profile.json";
const BRANCH       = process.env.GITHUB_BRANCH ?? "main";

const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

/* ── GET: إرجاع بيانات البروفايل ── */
export async function GET() {
  try {
    const res = await fetch(`${API_URL}?ref=${BRANCH}`, { headers, cache: "no-store" });
    if (!res.ok) {
      // الملف غير موجود بعد → أرجع الـ defaults
      return NextResponse.json(DEFAULT_PROFILE);
    }
    const data = await res.json();
    const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
    return NextResponse.json({ ...DEFAULT_PROFILE, ...content });
  } catch {
    return NextResponse.json(DEFAULT_PROFILE);
  }
}

/* ── POST: حفظ بيانات البروفايل ── */
export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json({ error: "GitHub env vars missing" }, { status: 500 });
  }

  try {
    const body = await req.json();

    // جيب الـ SHA الحالي للملف (مطلوب للـ update)
    let sha: string | undefined;
    const existing = await fetch(`${API_URL}?ref=${BRANCH}`, { headers, cache: "no-store" });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }

    const encoded = Buffer.from(JSON.stringify(body, null, 2)).toString("base64");

    const updateRes = await fetch(API_URL, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "update profile data",
        content: encoded,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ error: err }, { status: updateRes.status });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
