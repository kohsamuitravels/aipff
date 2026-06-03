import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    return NextResponse.redirect(
      `https://fearfold-poker-production-9694.up.railway.app/profile?code=${code}`
    )
  }

  return NextResponse.redirect(
    `https://fearfold-poker-production-9694.up.railway.app/?error=auth`
  )
}