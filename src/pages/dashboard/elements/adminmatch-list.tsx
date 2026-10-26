// import React from "react";
// import LMatch from "../../../models/LMatch";
// import moment from "moment";
// import { dateFormat } from "../../../utils/helper";

// import "./matchlist.css";

// interface MatchListProps {
//   matchList: LMatch[];
//   currentMatch: (match: LMatch) => void;
//   //   memoOdds: (marketId: string | null) => React.ReactNode;
// }

// const MatchList2: React.FC<MatchListProps> = ({
//   matchList,
//   currentMatch,
//   //   memoOdds,
// }) => {
//   //console.log(matchList, "matchlisy", currentMatch, "currentmatch", "memoodds");

//   return (
//     <div className="ml-wrapper">
//       {matchList?.map((match: LMatch, index: number) => {
//         const marketId =
//           match?.markets && match?.markets?.length > 0
//             ? match?.markets[0]?.marketId
//             : null;

//         const matchMoment = moment(match.matchDateTime);
//         const now = moment();

//         const isLive =
//           now.isSame(matchMoment, "day") && now.isAfter(matchMoment);
//         const isPast = matchMoment.isBefore(now, "day");

//         let statusLabel: "Live" | "Completed" | "Upcomming";
//         if (isLive) statusLabel = "Live";
//         else if (isPast) statusLabel = "Completed";
//         else statusLabel = "Upcomming";

//         return (
//           <div className="ml-row" key={match.matchId}>
//             <a
//               onClick={() => currentMatch(match)}
//               className="ml-left"
//               href={undefined}
//             >
//               <span
//                 className={
//                   statusLabel === "Live"
//                     ? "ml-badge ml-badge-live"
//                     : statusLabel === "Completed"
//                     ? "ml-badge ml-badge-completed"
//                     : "ml-badge ml-badge-upcoming"
//                 }
//               >
//                 {statusLabel}
//               </span>
//               <h5 className="ml-teamname">{match.name}</h5>
//             </a>

//             <div className="ml-right">
//               <span className="ml-date">
//                 {moment(match?.matchDateTime).format(dateFormat)}
//               </span>

//               <button
//                 className="ml-sport-btn"
//                 onClick={() => currentMatch(match)}
//               >
//                 <span className="ml-sport-e">E</span>
//                 <span className="ml-sport-divider"></span>
//                 <span className="ml-sport-name">CRICKET</span>
//               </button>
//             </div>

//             {/* {memoOdds(marketId)} */}
//           </div>
//         );
//       })}
//     </div>
//   );
// };
// export default MatchList2;


import React from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { dateFormat } from "../../../utils/helper";

import "./matchlist.css";

interface MatchListProps {
  matchList: LMatch[];
  currentMatch: (match: LMatch) => void;
}

const MatchList2: React.FC<MatchListProps> = ({
  matchList,
  currentMatch,
}) => {
  return (
    <div className="ml-wrapper">
      {matchList?.map((match: LMatch) => {
        const matchMoment = moment(match.matchDateTime);
        const now = moment();

        // Start time cross ho gaya to hamesha Live rahega
        const isLive = now.isSameOrAfter(matchMoment);

        const statusLabel: "Live" | "Upcoming" = isLive
          ? "Live"
          : "Upcoming";

        return (
          <div className="ml-row" key={match.matchId}>
            <a
              onClick={() => currentMatch(match)}
              className="ml-left"
              href={undefined}
            >
              <span
                className={
                  statusLabel === "Live"
                    ? "ml-badge ml-badge-live"
                    : "ml-badge ml-badge-upcoming"
                }
              >
                {statusLabel === "Live" && (
                  <span className="ml-live-dot"></span>
                )}

                {statusLabel}
              </span>

              <h5 className="ml-teamname">{match.name}</h5>
            </a>

            <div className="ml-right">
              <span className="ml-date">
                {moment(match?.matchDateTime).format(dateFormat)}
              </span>

              <button
                className="ml-sport-btn"
                onClick={() => currentMatch(match)}
              >
                <span className="ml-sport-e">E</span>
                <span className="ml-sport-divider"></span>
                <span className="ml-sport-name">CRICKET</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchList2;
