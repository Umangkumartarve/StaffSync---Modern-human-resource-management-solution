import React, { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import api, { fmtDate } from "../../api";
import { Empty } from "../ui";

const Trainings = () => {
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/trainings").then((r) => setList(r.data)); }, []);
  return (
    <div className="stack">
      {list.length === 0 && <Empty text="No trainings assigned to you yet." />}
      {list.map((t) => (
        <div className="card announce" key={t._id}>
          <GraduationCap size={24} color="#ec4899" />
          <div>
            <h3>{t.title}</h3><p>{t.description}</p>
            <span className="muted small">{fmtDate(t.date)} • Trainer: {t.trainer} • Assigned by {t.createdBy?.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trainings;
