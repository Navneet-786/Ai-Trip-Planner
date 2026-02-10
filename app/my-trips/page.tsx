"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUserDetail } from "../Provider";
import { TripInfo } from "../create-new-trip/_components/ChatBox";

export type Trip = {
  _id: string;
  tripId: string;
  tripDetail: TripInfo;
};

const MyTrips = () => {
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const convex = useConvex();
  const { userDetail } = useUserDetail();

  const GetUserTrips = async () => {
    if (!userDetail?._id) return;

    const result = await convex.query(api.tripDetail.GetUserTrips, {
      uid: userDetail._id,
    });

    setMyTrips(result);
  };

  useEffect(() => {
    userDetail && GetUserTrips();
  }, [userDetail]);

  return (
    <div className="px-4 py-10 w-full max-w-7xl mx-auto flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center">
        My Trips History
      </h2>

      {/* EMPTY STATE */}
      {myTrips.length === 0 && (
        <Card className="text-center py-10 bg-gradient-to-r from-pink-50 to-sky-100 w-full">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You haven’t created any trip plans yet.
            </p>
            <Link href="/create-new-trip">
              <Button>Create New Trip</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* TABLE */}
      {myTrips.length > 0 && (
        <Card className="bg-gradient-to-r from-pink-200 to-sky-200 w-full">
          <CardContent className="p-0 overflow-x-auto">
            {/* 👇 MOBILE SCROLL WRAPPER */}
            <div className="min-w-[700px] md:min-w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      Destination
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Duration
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Group
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Budget
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {myTrips.map((trip) => (
                    <TableRow
                      key={trip._id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {trip.tripDetail.destination}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {trip.tripDetail.duration} days
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {trip.tripDetail.group_size}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {trip.tripDetail.budget}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Planned</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DETAIL DIALOG */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="max-w-3xl">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle>
                  ✈️ {selectedTrip.tripDetail.destination}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <img
                  src="/Hotel1.jpg"
                  alt="Trip"
                  loading="lazy"
                  className="rounded-xl object-cover w-full h-56"
                />

                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Origin:</strong>{" "}
                    {selectedTrip.tripDetail.origin}
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {selectedTrip.tripDetail.duration} days
                  </p>
                  <p>
                    <strong>Group:</strong>{" "}
                    {selectedTrip.tripDetail.group_size}
                  </p>
                  <p>
                    <strong>Budget:</strong>{" "}
                    {selectedTrip.tripDetail.budget}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <Badge>
                      🏨 {selectedTrip.tripDetail.hotels.length} Hotels
                    </Badge>
                    <Badge>
                      🗓 {selectedTrip.tripDetail.itinerary.length} Days
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-right">
                <Link href={`/view-trip/${selectedTrip.tripId}`}>
                  <Button>View Full Trip</Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTrips;
