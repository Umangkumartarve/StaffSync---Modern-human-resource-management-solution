import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import api, { fmtDate } from "../../api";
import { Empty } from "../ui";

const Announcements = () => {
  const [list, setList] = useState(null);
  useEffect(() => { api.get("/announcements").then((r) => setList(r.data)); }, []);
  if (!list) return <p className="muted">Loading...</p>;
  return (
    <div className="stack">
      {list.length === 0 && <Empty text="No announcements yet." />}
      {list.map((a) => (
        <div className="card announce" key={a._id}>
          <Megaphone size={22} color="#3b82f6" />
          <div>
            <h3>{a.title}</h3>
            <p>{a.message}</p>
            <span className="muted small">Posted by {a.createdBy?.name} ({a.createdBy?.role}) on {fmtDate(a.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
