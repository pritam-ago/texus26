import React from "react";

const TermsPage = () => {
  const policies = [
    "• Once registration is completed, no refunds will be provided under any circumstances.",
    "• Participants are responsible for reviewing all event details before registering, as cancellations will not be entertained.",
    "• No exceptions will be made for personal reasons, including medical emergencies, scheduling conflicts, or unforeseen circumstances.",
    "• Registrations are non-transferable and cannot be shifted to another participant.",
    "• Failure to attend the event, for any reason, will not qualify for a refund or compensation.",
    "• The event organizers are not liable for any changes in personal plans or availability after registration.",
    "• In case of event rescheduling, participants will have the option to attend on the new date, but no refund requests will be accepted.",
    "• Any payment disputes or chargebacks will be denied based on this clearly stated no-refund policy.",
    "• Participants acknowledge and agree to this policy before making a payment.",
    "• By registering, you confirm that you fully understand and accept these terms without exceptions."
  ];
  return (
    <main className="w-full min-h-screen bg-black text-white">
      <div className="w-full h-full !pt-[8rem] p-4 md:p-16 max-w-7xl mx-auto flex flex-col gap-8">
        <h1 className="text-3xl font-montserrat">Refund Policy</h1>
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