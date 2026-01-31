import React from "react";

const PrivacyPage = () => {
  const policies = [
    "• The information you provide upon sign-up will be used to work out if the event is a success. It will not be shared with anyone except the funding partners. For all reporting purposes, everything will be anonymised, and your data will be safe. Information captured may change on an event-by-event basis due to partner requirements and research.",
    "• By signing up to an event you consent to us processing your information to be able to put the event on for you! We will also send you information about the event both before, during, and after the event.",
    "• There may be media present at our events, photos and video will be taken, so by signing-up and attending you give permission for any photos and/or video to be used in promotional activity. If you do not like any photos that are posted please ask and we will remove them.",
    "• You can attend any of the workshops you like!",
    "• We will contact you in the future to find out if the workshops have been useful for you.",
    "• We would collect and use personal data as needed for the purpose of research for some of the events.",
    "• We may allow third-party companies to serve ads and collect certain information when you visit the Site and Services. These companies may use certain information (e.g. click stream information, web browser type, time and date, subject of advertisements clicked or scrolled over) during your visits to the Site and other websites in order to provide advertisements about goods and services likely to be of interest to you.",
    "• Please be aware that whenever you share information on any public area of the Site or Services, that information may be accessed by others. In addition, please remember that when you share information in any other communications with third parties, that information may be passed along or made public by others.",
    "• We maintain physical, electronic, and procedural safeguards to protect the confidentiality and security of information transmitted to us. However, no data transmission over the Internet or other network can be guaranteed to be 100% secure. As a result, while we strive to protect information transmitted on or through the Site or Services, we cannot and do not guarantee the security of any information you transmit on or through the Site or Services, and you do so at your own risk.",
    "• Our Site and Services may contain links to other websites or allow others to send you such links. A link to a third party’s website does not mean that we endorse it or that we are affiliated with it. We do not exercise control over third-party websites. You access such third-party websites or content at your own risk. You should always read the privacy policy of a third-party website before providing any information to the website.",
  ];
  return (
    <main className="w-full min-h-screen bg-black text-white">
      <div className="w-full h-full !pt-[8rem] p-4 md:p-16 max-w-7xl mx-auto flex flex-col gap-8">
        <h1 className="text-3xl font-montserrat">Privacy Policy</h1>
        <div className="flex flex-col gap-6 mt-6">
          {policies?.map((policy, index) => {
            return (
              <p key={index} className="text-slate-200 font-montserrat text-justify">
                {policy}
              </p>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;