import React from "react";

const TermsPage = () => {
  const policies = [
    "• Students taking part in the events should register prior to the day of the fest. On-spot entry is not obliged.",
    "• Participants should go through the event rules and adhere to the specifics.",
    "• Participation, props, music, etc for certain events should be confirmed.",
    "• Once the payment is completed successfully it won’t be refunded under any circumstances.",
    "• If payment is failed from the client side the refund will be initiated only by the payment gateway or bank itself.",
    "• Once the entry passes have been purchased, they cannot be transferred.",
    "• While registering for a group event only one would be able to pay the full amount.",
    "•The participants are liable for gateway charges, which will be 2% of the whole transaction.",
    "• The tickets cannot be refunded in spite of not participating in the event.",
    "• All the events will commence at the scheduled time; Punctuality will be appreciated.",
    "• A participant can participate only in one event during the simultaneous timings for events; a participant is not restricted to participation in any number of events as long as the event timings do not clash.",
    "• The event timings and duration may clash with other events participants must consider this and plan it accordingly.",
    "• If it is a group activity event, entry will be denied if either one of the team members is absent as the event strictly requires a team of certain members.",
    "• It is recommended that you carefully review the schedules of all events you plan to attend before registering to avoid any potential conflicts. In the event that two events do occur simultaneously, you must prioritize and choose which event to attend.",
    "• It is also important to note that event schedules are subject to change, and the event organizer reserves the right to make changes to the schedule at any time. While the event organizer will make every effort to notify you of any changes to the schedule, it is ultimately your responsibility to stay informed of any updates or changes to the schedule.",
  ];
  return (
    <main className="w-full min-h-screen bg-black text-white">
      <div className="w-full h-full !pt-[8rem] p-4 md:p-16 max-w-7xl mx-auto flex flex-col gap-8">
        <h1 className="text-3xl font-montserrat">Terms and Conditions</h1>
        <div className="flex flex-col gap-6 mt-6">
          {policies?.map((policy, index) => {
            return (
              <p key={index} className="text-slate-200 font-montserrat">
                {policy}
              </p>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default TermsPage;