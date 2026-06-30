const { getDepots, getVehicles } = require("./apiService");
const selectVehicles = require("../utils/knapsack");

async function generateSchedule() {

    const depots = await getDepots();

    const vehicles = await getVehicles();

    return depots.map((depot) => {

        const result = selectVehicles(
            vehicles,
            depot.MechanicHours
        );

        return {
            depotId: depot.ID,
            mechanicHours: depot.MechanicHours,
            totalImpact: result.totalImpact,
            selectedVehicles: result.selectedVehicles,
        };
    });

}

module.exports = generateSchedule;