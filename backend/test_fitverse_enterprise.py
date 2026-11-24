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

    # 5. AI Workout Protocol Generation Test
    workout_res = client.post("/api/ai/workout", json={
        "age": 26,
        "height": 178.5,
        "weight": 74.0,
        "goal": "hypertrophy",
        "experience": "intermediate",
        "equipment": ["barbell", "dumbbells", "cables"],
        "injury": None
    })
    assert workout_res.status_code == 200
    w_data = workout_res.json()
    assert "HYPERTROPHY" in w_data["title"]
    assert len(w_data["schedule"]) >= 2
    assert w_data["estimated_duration"] > 0
    assert w_data["estimated_calories"] > 0
    print(f"✅ AI Workout Protocol: Generated '{w_data['title']}' ({w_data['estimated_duration']} min, {w_data['estimated_calories']} kcal)")

    # 6. AI Diet & Macro Protocol Generation Test
    diet_res = client.post("/api/ai/diet", json={
        "country": "India",
        "budget": "medium",
        "allergies": ["peanuts"],
        "preference": "high_protein",
        "target_calories": 2400.0
    })
    assert diet_res.status_code == 200
    d_data = diet_res.json()
    assert d_data["target_calories"] == 2400.0
    assert "protein" in d_data["macros"]
    assert "lunch" in d_data["meals"]
    assert len(d_data["shopping_list"]) >= 5
    print(f"✅ AI Diet Protocol: Target {d_data['target_calories']} kcal, {d_data['macros']['protein']} protein, {len(d_data['shopping_list'])} grocery items")

    # 7. AI Mood-Based Adaptive Recommendation Test
    mood_res = client.post("/api/ai/mood-recommendation?mood=tired")
    assert mood_res.status_code == 200
    m_data = mood_res.json()
    assert "Yoga" in m_data["workout"] or "Chill" in m_data["music"]
    print(f"✅ AI Mood Recommendation: 'tired' -> '{m_data['workout']}' with '{m_data['music']}'")

    # 8. Avatar State, Customization & Evolution Test
    avatar_get = client.get("/api/avatar/")
    assert avatar_get.status_code == 200
    av_data = avatar_get.json()
    assert av_data["level"] == 3
    assert av_data["gender"] == "Male"
    print(f"✅ Avatar Profile: Level {av_data['level']} {av_data['evolution_stage']} ({av_data['outfit']})")

    avatar_update = client.put("/api/avatar/update", json={
        "body_type": "Fit",
        "hair_style": "cyber_undercut",
        "outfit": "plasma_nano_suit"
    })
    assert avatar_update.status_code == 200
    up_av = avatar_update.json()
    assert up_av["avatar"]["hair_style"] == "cyber_undercut"
    print("✅ Avatar Customization: Updated hair to 'cyber_undercut' and outfit to 'plasma_nano_suit'")

    avatar_evolve = client.post("/api/avatar/evolve?xp=750&weight_change=-2.5")
    assert avatar_evolve.status_code == 200
    ev_data = avatar_evolve.json()
    assert ev_data["new_level"] == 7
    assert ev_data["evolved"] is True
    assert len(ev_data["unlocked_accessories"]) >= 2
    print(f"✅ Avatar Evolution: 750 XP -> Level {ev_data['new_level']} with {len(ev_data['unlocked_accessories'])} unlocked accessories")

    # 9. Music Recommendations & Mood Filtering Test
    music_mot = client.get("/api/music/recommendations?mood=motivated")
    assert music_mot.status_code == 200
    mot_tracks = music_mot.json()
    assert len(mot_tracks) >= 2
    assert all(t["mood"] == "motivated" for t in mot_tracks)
    print(f"✅ Music Recommendations: Found {len(mot_tracks)} high-energy tracks for 'motivated' mood")

    music_sad = client.get("/api/music/recommendations?mood=sad")
    assert music_sad.status_code == 200
    sad_tracks = music_sad.json()
    assert len(sad_tracks) >= 1
    assert sad_tracks[0]["title"] == "Midnight Zen"
    print(f"✅ Music Mood Filter: Retrieved '{sad_tracks[0]['title']}' by {sad_tracks[0]['artist']}")

    print("==================================================")
    print("🏆 ALL FITVERSE AI ENTERPRISE TESTS PASSED (100%)")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
