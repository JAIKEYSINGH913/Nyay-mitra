export const get_concept_drift = async (ipc_section: string) => {
  // Simulate API call to Siamese Transformer
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ipc: ipc_section,
        bns: "BNS_101",
        ipc_title: "Murder",
        bns_title: "Punishment for Murder",
        similarity: 0.98542,
        punishment_delta: [
          { label: "IPC_TERM", value: "Death/Life", color: "#e01e22" },
          { label: "BNS_TERM", value: "Death/Life", color: "#00E0FF" },
          { label: "STABILITY", value: "DEVIATION_0%", color: "#10b981" }
        ],
        report: "Statute structure preserved with 98% linguistic alignment. Fine scales updated to 2024 economic benchmarks."
      });
    }, 1500);
  });
};
