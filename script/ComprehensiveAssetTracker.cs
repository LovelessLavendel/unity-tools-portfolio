using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class ComprehensiveAssetTracker : MonoBehaviour
{
    private HashSet<string> sessionPaths = new HashSet<string>();

    /*private void Awake()
    {
        transform.SetParent(null);
        DontDestroyOnLoad(gameObject);
    }*/

    private void Update()
    {
        if (!Application.isPlaying) return;

        Object[] allObjects = Resources.FindObjectsOfTypeAll<Object>();
        foreach (Object obj in allObjects)
        {
            if (obj == null) continue;
#if UNITY_EDITOR
            string path = UnityEditor.AssetDatabase.GetAssetPath(obj);
            if (!string.IsNullOrEmpty(path) && path.StartsWith("Assets/"))
            {
                sessionPaths.Add(path);
            }
#endif
        }
    }

    private void OnApplicationQuit()
    {
#if UNITY_EDITOR
        // Wirf alten Editor-Ballast aus dem Speicher, bevor das Log geschrieben wird
        UnityEditor.EditorUtility.UnloadUnusedAssetsImmediate();
#endif

        string logFilePath = Path.Combine(Application.dataPath, "ComprehensiveUsedAssetsLog.txt");

        HashSet<string> allTimeUsedPaths = new HashSet<string>();
        if (File.Exists(logFilePath))
        {
            foreach (string line in File.ReadAllLines(logFilePath))
            {
                if (!string.IsNullOrEmpty(line)) allTimeUsedPaths.Add(line.Trim());
            }
        }

        foreach (string path in sessionPaths)
        {
            allTimeUsedPaths.Add(path);
        }

        File.WriteAllLines(logFilePath, allTimeUsedPaths);
        Debug.Log($"[Tracker] Spiel beendet. {allTimeUsedPaths.Count} aktive Assets wurden protokolliert.");
    }
}