"""
FitVerse AI — Backend Enterprise Test Suite
Verifies:
1. Redis-Style Sorted Set (ZSET) Leaderboard Operations (ZADD, ZINCRBY, ZREVRANGE, ZREVRANK)
2. GraphQL Field Selection Gateway payload reduction (>50% savings)
"""

import sys
import os

# Fix Windows cp1252 output encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend root is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    print("==================================================")
    print("🏋️ FITVERSE AI: ENTERPRISE TEST SUITE")
    print("==================================================")
    client = TestClient(app)

    # 1. Healthcheck Test
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("✅ Root API status: 200 OK")

    # 2. Redis ZSET Leaderboard Test
    top_res = client.get("/api/leaderboard/top?limit=3")
    assert top_res.status_code == 200
    top_data = top_res.json()
    assert len(top_data) == 3
    assert top_data[0]["rank"] == 1
    assert top_data[0]["streak_days"] >= top_data[1]["streak_days"]
    print(f"✅ Redis ZSET Leaderboard Top 1: {top_data[0]['username']} ({top_data[0]['streak_days']} day streak)")

    # 3. ZINCRBY Streak Update Test
    update_res = client.post("/api/leaderboard/streak", json={
        "user_id": "usr_tester_99",
        "username": "ShadowRunner",
        "streak_increment": 5,
        "xp_bonus": 250
    })
    assert update_res.status_code == 200
    up_data = update_res.json()
    assert up_data["current_streak"] == 5
    assert up_data["total_xp"] == 250
    print(f"✅ Redis ZINCRBY: Streak updated to {up_data['current_streak']} days (Rank: {up_data['global_rank']})")

    # 4. GraphQL Field Selection & Payload Reduction Test
    gql_query = """
    query {
      getWorkoutPlan {
        title
        exercises {
          name
          reps
        }
      }
    }
    """
    gql_res = client.post("/api/graphql", json={"query": gql_query})
    assert gql_res.status_code == 200
    gql_data = gql_res.json()
    
    plan = gql_data["data"]["getWorkoutPlan"]
    assert "title" in plan
    assert "exercises" in plan
    assert len(plan["exercises"]) > 0
    assert "name" in plan["exercises"][0]
    assert "reps" in plan["exercises"][0]
    # Verify omitted heavy fields
    assert "video_demo_url" not in plan["exercises"][0]
    assert "3d_rig_mesh_url" not in plan["exercises"][0]

    perf = gql_data["extensions"]["performance"]
    savings_str = perf["bandwidth_savings_pct"]
    savings_val = float(savings_str.replace("%", ""))
    print(f"✅ GraphQL Field Filter: Raw {perf['raw_bytes']}B -> Filtered {perf['filtered_bytes']}B ({savings_str} cellular savings)")
    assert savings_val > 50.0, f"Expected >50% savings, got {savings_val}%"

    print("==================================================")
    print("🏆 ALL FITVERSE AI ENTERPRISE TESTS PASSED (100%)")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
