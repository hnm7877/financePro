import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Associate } from "@/models/Associate";

export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const result = await Associate.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ message: "Associé non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ message: "Associé supprimé avec succès" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await req.json();

    // If share is provided, convert from percentage to decimal
    if (updates.share !== undefined) {
      updates.share = updates.share / 100;
    }

    // Role is now roles (array), frontend should send roles.
    // Mongoose will handle the array update if roles is provided in updates.

    const associate = await Associate.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!associate) {
      return NextResponse.json({ message: "Associé non trouvé" }, { status: 404 });
    }
    return NextResponse.json(associate);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
