"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

interface StudentCoordinator {
  name: string;
  contact: string;
}

interface FacultyCoordinator {
  name: string;
  contact: string;
}

interface EventDetail {
  id: number;
  name: string;
  description: string;
  rules: string[];
  venue: string;
  event_time: string;
  entry_fee: number;
  team_size_min: number;
  team_size_max: number;
  student_coordinators: StudentCoordinator[];
  faculty_coordinators: FacultyCoordinator[];
  department: string;
  event_type: string;
}

export default function NonTechEventsExportDetailed() {
  const events: EventDetail[] = [
    {
      id: 2519,
      name: "Beast Games 2.0",
      description: "The beast games 2.0 is a multi-stage event featuring 15 teams, each with 3 players, competing through elimination-based games that test physical endurance, mental agility, and luck. In Round 1, teams search for hidden texus logos across rooms, with the first 10 teams to find them qualifying for the next round. Round 2 splits players into three categories—Physical, Mental, and Luck—with the winners advancing to the final round. In Round 3, the three finalists each receive a mystery box, where only one contains the prize money.",
      rules: [
        "The event consists of three rounds. In Round 1, teams must locate hidden individuals to qualify. 10 teams advance to Round 2, where each team assigns one player to compete in Physical, Mental, or Luck-based challenges. The winner of each challenge moves to the final round. Round 3 is the deception game. The three finalists receive mystery boxes, one containing prize money. Players can only see their own box. They must convince others who to eliminate.",
        "A team must comprise of either all boys or mixed but not all girls"
      ],
      venue: "Admin 201",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 3,
      team_size_max: 3,
      student_coordinators: [
        { name: "Pavithran", contact: "8248658834" },
        { name: "Gopi Krishna", contact: "8122144593" },
        { name: "Krishna Kumar", contact: "9176321861" }
      ],
      faculty_coordinators: [
        { name: "Dr. Arthi B", contact: "9176987570" },
        { name: "Ms. Swathi", contact: "8754230477" },
        { name: "Dr.R.Vinoth", contact: "9791209067" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2577,
      name: "LINK-IT",
      description: "A word will be displayed through a set of photos and the participants have to connect the photos and find the Answer.",
      rules: [
        "A time limit will be set for each team's argument. Exceeding it may lead to penalties."
      ],
      venue: "CAD LAB",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 2,
      team_size_max: 2,
      student_coordinators: [
        { name: "SANTHOSHKUMAR C", contact: "9500927544" },
        { name: "SAHITHI SRAVANTHI D", contact: "7702382184" }
      ],
      faculty_coordinators: [
        { name: "Dr.Chellaiah", contact: "9442063565" },
        { name: "Dr.Parthiban", contact: "7708600209" }
      ],
      department: "MECHANICAL",
      event_type: "non_technical_event"
    },
    {
      id: 2543,
      name: "Open To Stage",
      description: "\"Open to Stage\" is an exciting platform for individuals to showcase their artistic talents in solo singing, solo dancing, and solo instrumental performances. This event encourages creativity and self-expression, allowing participants to captivate the audience with their unique skills. Whether through music, movement, or melody, performers get the opportunity to shine and leave a lasting impression in a vibrant and supportive atmosphere.",
      rules: [
        "Singing: 1.Solo performance only. 2.Any song in any language (without karaoke). 3.No vulgar songs allowed. 4.Performance duration: 2 minutes.",
        "Dancing: 1.Solo performances only. 2.No vulgar songs or steps allowed. 3.Performance duration: 2 minutes. 4.Audio track must be submitted prior to the event.",
        "Instrumental: 1.Solo performance only. 2.Perform with any musical instrument of your choice. 3.Performance duration: 2 minutes."
      ],
      venue: "GALLERY HALL 3",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 100,
      team_size_min: 1,
      team_size_max: 1,
      student_coordinators: [
        { name: "B.s.gireesh", contact: "9566219733" },
        { name: "D.sriram", contact: "6374205754" }
      ],
      faculty_coordinators: [
        { name: "Mr.Kumaresan", contact: "8610460975" },
        { name: "Mr.Vijayan", contact: "9489257204" }
      ],
      department: "CIVIL",
      event_type: "non_technical_event"
    },
    {
      id: 2572,
      name: "Acting It Out",
      description: "\"Tech Charades – Act it, Guess it, Win it!\"\nStudents will act out tech-related words and phrases while their teammates try to guess them within a time limit. No speaking or lip movements—just pure gestures and creativity!",
      rules: [
        "No external help(mobile phones, internet, notes, etc.) is allowed during the event."
      ],
      venue: "BMS 802",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 3,
      team_size_max: 5,
      student_coordinators: [
        { name: "Pushpa Beniwal", contact: "7010092241" },
        { name: "Kanishka", contact: "6380556991" },
        { name: "Nithin", contact: "9176132636" }
      ],
      faculty_coordinators: [
        { name: "Dr.Sudharshan", contact: "9500052352" },
        { name: "Dr.Dwarakanth", contact: "8870080699" },
        { name: "Dr.Rama", contact: "9952001663" }
      ],
      department: "IT",
      event_type: "non_technical_event"
    },
    {
      id: 2521,
      name: "PIXELCON",
      description: "Arcade Showcase: Play and experience our latest games firsthand!",
      rules: [
        "1. Individual participation only. 2. One game at a time. 3. Participants can play within 10 minutes."
      ],
      venue: "Admin 102",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 100,
      team_size_min: 1,
      team_size_max: 1,
      student_coordinators: [
        { name: "Adithya A", contact: "9633230876" },
        { name: "S. Ankit Ram", contact: "9600179797" },
        { name: "Abishek Arun", contact: "8921214343" }
      ],
      faculty_coordinators: [
        { name: "Mrs. Kudiyarasudevi C", contact: "9791045731" },
        { name: "Dr. Judy Flavia B", contact: "9176987570" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2563,
      name: "FIFA",
      description: "The FIFA PlayStation, where players can expect thrilling tournaments, exclusive in-game rewards, and live-streamed action. Special challenges and promotions will be available for FIFA",
      rules: [
        "Judging criteria include creativity, humor, relevance to the character, teamwork, and persuasion skills."
      ],
      venue: "BMS 701",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 2,
      team_size_max: 2,
      student_coordinators: [
        { name: "Krishang", contact: "7358437014" },
        { name: "Rakeshkumar", contact: "9566232538" },
        { name: "Pawan", contact: "8838492278" }
      ],
      faculty_coordinators: [
        { name: "Dr.K.Danesh", contact: "9790833475" },
        { name: "Dr.P.Santhosh Kumar", contact: "8870080699" },
        { name: "Ms.Rajalakshmi", contact: "7010123177" }
      ],
      department: "IT",
      event_type: "non_technical_event"
    },
    {
      id: 2567,
      name: "Shipwreck",
      description: "Shipwreck is an exciting debate-style event where teams of two participants take on the roles of famous personalities and find themselves aboard a sinking ship. Their mission? To convince the captain (judge) why they deserve the only lifeboat available. Teams must use wit, creativity, and persuasive arguments to outshine their competitors and secure their survival!",
      rules: [
        "Two participants per team. Each team will represent a character or a duo."
      ],
      venue: "BMS 601",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 100,
      team_size_min: 1,
      team_size_max: 2,
      student_coordinators: [
        { name: "Roshan S", contact: "7530006460" },
        { name: "Pooja Sree V", contact: "8637440418" },
        { name: "Sree Lakshmi", contact: "8925244206" },
        { name: "Varsha Anbumani", contact: "8838193588" }
      ],
      faculty_coordinators: [
        { name: "Dr. C.Abirami", contact: "9445412917" }
      ],
      department: "EFL",
      event_type: "non_technical_event"
    },
    {
      id: 2524,
      name: "Channel Surfing",
      description: "A fast-paced performance where teams act out different TV channels with seamless transitions and high energy.",
      rules: [
        "Teams must perform a series of TV channel segments based on random prompts. Each team must have 3-5 members."
      ],
      venue: "GALLERY HALL 1",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 3,
      team_size_max: 6,
      student_coordinators: [
        { name: "S H Mohammed Aadhil", contact: "7358444833" },
        { name: "V B Mani Bharathi", contact: "9361464082" }
      ],
      faculty_coordinators: [
        { name: "Mrs. M. Snehapriya", contact: "9087417842" },
        { name: "Dr. R. Nagalakshmi", contact: "9884483697" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2525,
      name: "Voice it",
      description: "Welcome to VOICE IT – The Ultimate Debate Showdown! Are you ready to put your arguments to the test? \nVOICE IT is a high energy debate competition where quick thinking meets persuasive speech!\nA single topic, two opposing sides, and 45 minutes of intense debate where every minute counts as you challenge, counter, and dominate the discussion. Get ready for a spontaneous battle of wits,\nthought-provoking discussions, counterarguments, and intellectual battles where every word counts while keeping the decorum intact and only the most convincing team takes the crown.\"Step up, speak out, and own the debate! Join us and let the best arguments win!\"",
      rules: [
        "⁠A specific topic or issue is chosen. The host announces the topic at the beginning.",
        "Participants are divided into two opposing groups: one supporting the topic and the other opposing it.",
        "Participants in both the panels can share views, opinions, experiences and ask questions to other side regarding the topic.",
        "The host controls the flow of the conversation, asks questions, and ensures that no one speaks over each other.",
        "The side which gives better points and convinces the host wins.",
        "Participants should maintain the decorum and no use of foul language."
      ],
      venue: "Admin 104",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 100,
      team_size_min: 2,
      team_size_max: 2,
      student_coordinators: [
        { name: "Nikhita", contact: "8122666847" },
        { name: "Pooja", contact: "9363040254" },
        { name: "Sakthi", contact: "9944912153" }
      ],
      faculty_coordinators: [
        { name: "Ms.Vaishnavii", contact: "9629909658" },
        { name: "Dr.Saraswathi", contact: "9444580802" },
        { name: "Ms.Abirami", contact: "9940532854" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2593,
      name: "IPL AUCTION",
      description: "Step into the thrill of the IPL Auction, a high-stakes bidding war where strategy meets competition!\nThis exciting non-tech event challenges participants to channel their inner team owners, bidding for top cricket players to create the ultimate dream team.\nWith a set budget, teams must make smart decisions, balancing star power and squad depth to outmaneuver their rivals. \nQuick thinking, negotiation skills, and strategic planning are key to securing the best players while staying within financial limits.\nDo you have what it takes to build a championship-winning team? Join us and experience the adrenaline rush of the IPL Auction!",
      rules: [
        "Round 1 (MCQ Quiz): Top 10 teams would go for auction",
        "Round 2 (Auction): The players would be given points with respect to their skills and performance in the previous matches.",
        "The challenge is to strategically select players to form a balanced team while maximizing the total team points. The team with the highest cumulative points at the end of the auction will be declared the winner.",
        "Scoring & Judging: Accuracy, speed, and correctness determine winners. Judges' decisions are final.",
        "Fair Play & Conduct: No cheating, external help, or misconduct. Violators face immediate disqualification.",
        "Prizes & Awards: Top 2 teams receive cash prizes, momento & certificates."
      ],
      venue: "Block III 302",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 2,
      team_size_max: 2,
      student_coordinators: [
        { name: "C CANISHE", contact: "8438464707" },
        { name: "BALA BRAHMARSH", contact: "9866799339" }
      ],
      faculty_coordinators: [
        { name: "Dr.K.Srisabarimani", contact: "9445174631" },
        { name: "Dr.P.Ramani", contact: "9894065680" }
      ],
      department: "ECE",
      event_type: "non_technical_event"
    },
    {
      id: 2522,
      name: "Real or Ruse?",
      description: "Real or Ruse? is an exciting knowledge-based game where players compete in pairs to distinguish facts from myths. Each round presents two statements—one true, one false—and teams must work together to identify the fact.",
      rules: [
        "1. Each round, all teams receive two statements—one fact and one myth. 2. Teams have 10 seconds to discuss and select the fact. 3. Each correct answer earns 10 points. 4. 20 teams will be selected for next round."
      ],
      venue: "BMS 501",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 2,
      team_size_max: 2,
      student_coordinators: [
        { name: "K. Nethra", contact: "9445378170" },
        { name: "Thulasi Ganavi", contact: "7411091264" }
      ],
      faculty_coordinators: [
        { name: "Mrs.Diana Rachal I", contact: "9003011926" },
        { name: "Mrs.Vinitha Yesuraj", contact: "9940390755" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2520,
      name: "UNFINISHED VISION",
      description: "Step into a world where imagination meets art! Unfinished Vision is a creative showdown that challenges participants to think beyond boundaries and bring their artistic vision to life. Whether it's expressing emotions through sketches or completing half-drawn artworks with your unique perspective, this event is all about storytelling through art. Let your creativity flow and showcase how a single stroke can redefine an entire picture!",
      rules: [
        "Round 1: The Emotion Sketch - Participants must draw an emotion without using facial expressions or direct hints. The top 10 participants with the most expressive and creative sketches will be selected for the next round.",
        "Round 2: The Unfinished Art - Each participant will receive a paper with a half-drawn image. The challenge is to complete the artwork using their imagination (e.g., a half-innocent, half-powerful depiction of a woman). The final piece will be judged based on creativity, originality, and concept execution.",
        "Participants must bring their own art supplies.",
        "The best imaginative drawing will be declared the winner."
      ],
      venue: "BMS 402",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 50,
      team_size_min: 1,
      team_size_max: 1,
      student_coordinators: [
        { name: "Sushree Sangita Ray", contact: "8778216986" },
        { name: "Thanvarshini", contact: "9344894202" }
      ],
      faculty_coordinators: [
        { name: "Mr. A. Madhu", contact: "9841846951" },
        { name: "G.D.Meivezhi", contact: "7010194743" },
        { name: "S.Kamaleswari", contact: "7418743061" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2526,
      name: "BRAIN CHAIN",
      description: "Welcome to Brain Chain – The Ultimate Fandom & Music Showdown!\nGet ready to dive into a high-energy battle of wits, tunes, and fandom connections! This isn't just a quiz—it's an adrenaline-pumping experience where every second counts. From cracking jumbled dialogues and connecting iconic scenes to identifying electrifying BGMs and reverse audio clips, every challenge will test your fandom instincts. Bet big on your knowledge, catch a ball for a surprise twist, and brace yourself for unexpected comebacks! With epic music, mind-bending visuals, and nonstop fun, this is your chance to prove you're the ultimate fan. Think fast, play hard, and let the fandom and music madness begin!",
      rules: [
        "maximum two members in a team",
        "teams must identify and form connections using given clues",
        "the questions asked will be based on different genres with movies, series, songs from various fields with exciting dares and challenges",
        "whichever team raises the hands first they will get a chance to answer"
      ],
      venue: "LH 403 Block 3",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 2,
      team_size_max: 2,
      student_coordinators: [
        { name: "SREENIDHI. S", contact: "7823972212" },
        { name: "U. DHANUSH", contact: "9360346664" },
        { name: "Abinaya", contact: "9597068773" }
      ],
      faculty_coordinators: [
        { name: "Dr. R. INDHUMATHI", contact: "7550231120" }
      ],
      department: "BIOMEDICAL",
      event_type: "non_technical_event"
    },
    {
      id: 2518,
      name: "Valorant",
      description: "Gear up for an intense showdown in the ultimate Valorant tournament! Whether you're a sharpshooter, a strategic mastermind, or a clutch king, this is your chance to prove your skills and dominate the battlefield. Assemble your squad, execute perfect site takes, and outplay your opponents in a high-stakes, action-packed competition. With thrilling matches, top-tier strategies, and electrifying moments, this tournament promises an adrenaline rush like no other. Do you have what it takes to be the last team standing? Lock in your agents, sharpen your reflexes, and get ready for battle!",
      rules: [
        "1. Team Setup – Each team must have 5 players (1 substitute allowed). Account sharing is not allowed.",
        "2. Match Timings – Teams must be ready 10 minutes before their match. A 15-minute delay results in a forfeit.",
        "3. Game Format – Matches will be Best of 1 (BO1) until finals. Finals will be Best of 1 (BO1). Maps will be chosen via bans & picks. MAP:HAVEN",
        "4. Game Settings – Standard competitive settings apply. Overtime will follow Valorant's default rules (win by 2 rounds). Players must not exploit game bugs or use unfair tactics.",
        "5. Streaming & Spectators – Only authorized spectators are allowed. Players cannot live stream their matches unless permitted by the organizers.",
        "6. Rule Violations – Breaking any rules may lead to warnings, round losses, or disqualification, depending on the severity."
      ],
      venue: "ONLINE",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 200,
      team_size_min: 1,
      team_size_max: 5,
      student_coordinators: [
        { name: "Aadhitya", contact: "8122744805" },
        { name: "Miruthiyunchayan", contact: "6382890701" },
        { name: "Sathish", contact: "7305431315" }
      ],
      faculty_coordinators: [
        { name: "Dr K Ramya", contact: "9944026001" },
        { name: "Ms. S. Sivasankari", contact: "9952976203" },
        { name: "Ms.Lakshmi", contact: "9962485494" }
      ],
      department: "SCSE",
      event_type: "non_technical_event"
    },
    {
      id: 2590,
      name: "Beat the clock",
      description: "Beat the Clock is an exciting and competitive event where participants are tasked with completing various challenges or tasks within a set time limit. Each round of the event presents a different task, and the key objective is to finish each task in the shortest amount of time possible. The participant who completes all the rounds, or the final round, in the least time is declared the winner. \nThe event is designed to test participants' speed, problem-solving skills, and ability to perform under pressure. Each task may vary in nature, requiring different skills such as agility, logic, or creativity. The clock is constantly ticking, creating a sense of urgency and excitement throughout the competition. As the rounds progress, tasks may become increasingly difficult, adding to the challenge. In the end, it's not just about completing the tasks but doing so in record time to \"beat the clock\" and emerge as the champion.",
      rules: [
        "Individual participation",
        "Solve six or more tasks in minimum time duration.",
        "The one who completes early will be selected as winner.",
        "Winner from each round will be proceeded for the next round",
        "Tasks will be changed for every round.",
        "Any participant who evades the rules will be disqualified on the spot.",
        "One winner and one runner will be declared at the end of the event."
      ],
      venue: "Block III 501",
      event_time: "2025-03-29 09:00:00",
      entry_fee: 100,
      team_size_min: 1,
      team_size_max: 1,
      student_coordinators: [
        { name: "Ranjith.V", contact: "8925777035" },
        { name: "Celina Jeslyn", contact: "9344103133" },
        { name: "Ramya.M", contact: "6382289727" }
      ],
      faculty_coordinators: [
        { name: "Dr.Monika.V", contact: "9487990887" }
      ],
      department: "BIOTECHNOLOGY",
      event_type: "non_technical_event"
    }
  ];

  const exportToExcel = () => {
    // Prepare data for Excel with all details
    const excelData = events.map((event) => {
      const rules = event.rules.join("; ");

      const studentCoords = event.student_coordinators
        ?.map((coord) => `${coord.name} (${coord.contact})`)
        .join("; ") || "";

      const facultyCoords = event.faculty_coordinators
        ?.map((coord) => `${coord.name} (${coord.contact})`)
        .join("; ") || "";

      return {
        "Event ID": event.id,
        "Event Name": event.name,
        "Description": event.description,
        "Rules": rules,
        "Venue": event.venue,
        "Event Date & Time": new Date(event.event_time).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        "Entry Fee (₹)": event.entry_fee,
        "Team Size": `${event.team_size_min}-${event.team_size_max}`,
        "Department": event.department,
        "Student Coordinators": studentCoords,
        "Faculty Coordinators": facultyCoords,
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 10 },  // Event ID
      { wch: 25 },  // Event Name
      { wch: 60 },  // Description
      { wch: 80 },  // Rules
      { wch: 20 },  // Venue
      { wch: 25 },  // Event Date & Time
      { wch: 12 },  // Entry Fee
      { wch: 12 },  // Team Size
      { wch: 20 },  // Department
      { wch: 60 },  // Student Coordinators
      { wch: 60 },  // Faculty Coordinators
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Non Tech Events Details");

    // Generate Excel file
    XLSX.writeFile(wb, "TEXUS_2025_Non_Tech_Events_Details.xlsx");
  };

  const formatRules = (rules: string[]) => {
    return rules;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            TEXUS 2025 - Non Technical Events Details
          </h1>
          <p className="text-gray-400 text-lg">
            SRMIST-RAMAPURAM, Faculty of Engineering and Technology
          </p>
          <p className="text-gray-400">March 28-29, 2025</p>

          {/* Export Button */}
          <button
            onClick={exportToExcel}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            📥 Export Complete Details to Excel
          </button>
        </div>

        {/* Events Grid */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              {/* Event Header */}
              <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 border-b border-gray-700">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-purple-400 bg-purple-900/30 px-3 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        ID: {event.id}
                      </span>
                      <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                        {event.department}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Entry Fee</div>
                    <div className="text-2xl font-bold text-green-400">
                      ₹{event.entry_fee}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-6 space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-400 mb-2">
                    📋 Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="text-sm font-semibold text-pink-400 mb-2">
                    📜 Rules & Guidelines
                  </h3>
                  <ul className="space-y-2">
                    {formatRules(event.rules).map((rule, idx) => (
                      <li
                        key={idx}
                        className="text-gray-300 pl-4 border-l-2 border-gray-600"
                      >
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">📍 Venue</div>
                    <div className="text-sm font-semibold text-white">
                      {event.venue}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">
                      🕐 Date & Time
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {new Date(event.event_time).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">
                      👥 Team Size
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {event.team_size_min} - {event.team_size_max} members
                    </div>
                  </div>
                </div>

                {/* Coordinators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Student Coordinators */}
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <h3 className="text-sm font-semibold text-blue-400 mb-3">
                      👨‍🎓 Student Coordinators
                    </h3>
                    <div className="space-y-2">
                      {event.student_coordinators?.map((coord, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-300">{coord.name}</span>
                          <a
                            href={`tel:${coord.contact}`}
                            className="text-blue-400 hover:text-blue-300 font-mono"
                          >
                            {coord.contact}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Faculty Coordinators */}
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
                    <h3 className="text-sm font-semibold text-purple-400 mb-3">
                      👨‍🏫 Faculty Coordinators
                    </h3>
                    <div className="space-y-2">
                      {event.faculty_coordinators?.map((coord, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-300">{coord.name}</span>
                          <a
                            href={`tel:${coord.contact}`}
                            className="text-purple-400 hover:text-purple-300 font-mono"
                          >
                            {coord.contact}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">📊 Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {events.length}
              </div>
              <div className="text-sm text-gray-400">Total Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">
                {new Set(events.map((e) => e.department)).size}
              </div>
              <div className="text-sm text-gray-400">Departments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                ₹{Math.min(...events.map((e) => e.entry_fee))} - ₹
                {Math.max(...events.map((e) => e.entry_fee))}
              </div>
              <div className="text-sm text-gray-400">Entry Fee Range</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                Mar 28-29
              </div>
              <div className="text-sm text-gray-400">Event Dates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
