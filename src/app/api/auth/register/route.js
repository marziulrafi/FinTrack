import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Missing email or password" }), { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    await user.save();

    return new Response(JSON.stringify({ ok: true, message: "User created" }), { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
